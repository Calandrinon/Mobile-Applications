import React, {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { ItemProps } from './ItemProps';
import {createItem, getItems, newWebSocket, sendNewOfflineDataToServer, updateItem} from './itemApi';
import { AuthContext } from '../auth';
import {Network, Storage} from "@capacitor/core";
import {useNetwork} from "../statusHooks/useNetwork";
import {useAppState} from "../statusHooks/useAppState";

const log = getLogger('ItemProvider');

type SaveItemFn = (item: ItemProps) => Promise<any>;

export interface ItemsState {
  items?: ItemProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  savingError?: Error | null,
  saveItem?: SaveItemFn,
}

interface ActionProps {
  type: string,
  payload?: any,
}

const initialState: ItemsState = {
  fetching: false,
  saving: false,
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';
const DELETE_ITEM_FAILED = 'DELETE_ITEM_FAILED';
const DELETE_ITEM_SUCCEEDED = 'DELETE_ITEM_SUCCEEDED';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState =
  (state, { type, payload }) => {
    switch (type) {
      case FETCH_ITEMS_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_ITEMS_SUCCEEDED:
        return { ...state, items: payload.items, fetching: false };
      case FETCH_ITEMS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      case SAVE_ITEM_STARTED:
        return { ...state, savingError: null, saving: true };
      case SAVE_ITEM_SUCCEEDED:
        const items = [...(state.items || [])];
        const item = payload.item;
        const index = items.findIndex(it => it._id === item._id);
        if (index === -1) {
          items.splice(0, 0, item);
        } else {
          items[index] = item;
        }
        return { ...state, items, saving: false };
      case SAVE_ITEM_FAILED:
        return { ...state, savingError: payload.error, saving: false };
      default:
        return state;
    }
  };

export const ItemContext = React.createContext<ItemsState>(initialState);

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, fetching, fetchingError, saving, savingError } = state;

  useEffect(() => {
    Network.addListener('networkStatusChange', async (status) => {
      if (status.connected) {
        let localStorageItems = JSON.parse((await Storage.get({key: "savedTasks"})).value);
        console.log("NETWORK STATUS CHANGE EFFECT");
        console.log(localStorageItems);
        let response = await sendNewOfflineDataToServer(token, localStorageItems);
        console.log("SERVER RESPONSE WITH UPDATED DATA:");
        console.log(response);
      } else {
        alert("Your internet connection is off. All items created are saved in the local storage and synchronized when the connection is restored.");
      }
    });
  }, []);

  useEffect(getItemsEffect, [token]);
  useEffect(wsEffect, [token]);
  const saveItem = useCallback<SaveItemFn>(saveItemCallback, [token]);
  const value = { items, fetching, fetchingError, saving, savingError, saveItem };

  log('returns');

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );


  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    }

    async function fetchItems() {
      if (!token?.trim()) {
        return;
      }
      try {
        log('fetchItems started');
        let items;
        if (navigator.onLine) {
          dispatch({ type: FETCH_ITEMS_STARTED });
          items = await getItems(token);
          await Storage.set({key: "savedTasks", value: JSON.stringify(items)});
        } else {
          items = await Storage.get({key: "savedTasks"});
          items = JSON.parse(items.value);
        }
        log('fetchItems succeeded');
        if (!canceled) {
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
        }
      } catch (error) {
        log('fetchItems failed');
        dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
      }
    }
  }

  async function saveItemCallback(item: ItemProps) {
    try {
      log('saveItem started');
      dispatch({ type: SAVE_ITEM_STARTED });
      let savedItem;
      if (navigator.onLine) {
        savedItem = await (item._id ? updateItem(token, item) : createItem(token, item));
      } else {
        let userId = await Storage.get({key: "userId"});
        savedItem = {...item, userId: userId.value};
        let savedTasks = JSON.parse((await Storage.get({key: "savedTasks"})).value);
        savedTasks.push(savedItem);
        await Storage.set({key: "savedTasks", value: JSON.stringify(savedTasks)});
      }
      dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
      log('saveItem succeeded');
    } catch (error) {
      log('saveItem failed');
      dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
    }
  }

  function wsEffect() {
    let canceled = false;
    log('wsEffect - connecting');
    let closeWebSocket: () => void;
    if (token?.trim()) {
      closeWebSocket = newWebSocket(token, message => {
        if (canceled) {
          return;
        }
        const { type, payload: item } = message;
        let parsedItemJSON = JSON.parse(JSON.stringify(item));
        log(`ws message, item ${type}`);
        if (type === 'created' || type === 'updated') {
          dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item } });
        }
      });
    }
    return () => {
      log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket?.();
    }
  }
};
