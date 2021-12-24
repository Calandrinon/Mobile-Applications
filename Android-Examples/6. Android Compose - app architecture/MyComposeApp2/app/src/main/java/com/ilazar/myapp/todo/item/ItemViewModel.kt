package com.ilazar.myapp.todo.item

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ilazar.myapp.core.TAG
import com.ilazar.myapp.todo.data.Item
import com.ilazar.myapp2.todo.data.ItemRepository
import kotlinx.coroutines.launch

class ItemViewModel : ViewModel() {
    private val mutableItem = MutableLiveData<Item>().apply { value = Item("", "") }
    private val mutableFetching = MutableLiveData<Boolean>().apply { value = false }
    private val mutableCompleted = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Throwable>().apply { value = null }

    val item: LiveData<Item> = mutableItem
    val fetching: LiveData<Boolean> = mutableFetching
    val fetchingError: LiveData<Throwable> = mutableException
    val completed: LiveData<Boolean> = mutableCompleted

    fun loadItem(itemId: String) {
        viewModelScope.launch {
            Log.i(TAG, "loadItem...")
            mutableFetching.value = true
            mutableException.value = null
            val result = ItemRepository.load(itemId)
            if (result.isSuccess) {
                Log.d(TAG, "loadItem succeeded");
                mutableItem.value = result.getOrNull()
            }
            if (result.isFailure) {
                Log.w(TAG, "loadItem failed", result.exceptionOrNull());
                mutableException.value = result.exceptionOrNull()
            }
        }
        mutableFetching.value = false

    }

    fun saveOrUpdateItem(text: String) {
        viewModelScope.launch {
            Log.v(TAG, "saveOrUpdateItem...");
            val item = mutableItem.value ?: return@launch
            item.text = text
            mutableFetching.value = true
            mutableException.value = null
            val result: Result<Item>
            if (item._id.isNotEmpty()) {
                result = ItemRepository.update(item)
            } else {
                result = ItemRepository.save(item)
            }
            if (result.isSuccess) {
                Log.d(TAG, "saveOrUpdateItem succeeded");
                mutableItem.value = result.getOrNull()
            }
            if (result.isFailure) {
                Log.w(TAG, "saveOrUpdateItem failed", result.exceptionOrNull());
                mutableException.value = result.exceptionOrNull()
            }
            mutableCompleted.value = true
            mutableFetching.value = false
        }
    }
}
