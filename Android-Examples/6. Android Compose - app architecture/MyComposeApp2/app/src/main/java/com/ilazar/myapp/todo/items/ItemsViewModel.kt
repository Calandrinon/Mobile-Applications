package com.ilazar.myapp.todo.items

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ilazar.myapp.core.TAG
import com.ilazar.myapp.todo.data.Item
import com.ilazar.myapp2.todo.data.ItemRepository
import kotlinx.coroutines.launch

class ItemsViewModel : ViewModel() {
    private val mutableItems = MutableLiveData<List<Item>>().apply { value = emptyList() }
    private val mutableLoading = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Throwable>().apply { value = null }

    val items: LiveData<List<Item>> = mutableItems
    val loading: LiveData<Boolean> = mutableLoading
    val loadingError: LiveData<Throwable> = mutableException

    init {
        loadItems()
    }

    fun loadItems() {
        viewModelScope.launch {
            Log.v(TAG, "loadItems...");
            mutableLoading.value = true
            mutableException.value = null
            val result = ItemRepository.loadAll()
            if (result.isSuccess) {
                Log.d(TAG, "loadItems succeeded");
                mutableItems.value = result.getOrNull()
            }
            if (result.isFailure) {
                Log.w(TAG, "loadItems failed", result.exceptionOrNull());
                mutableException.value = result.exceptionOrNull()
            }
            mutableLoading.value = false
        }
    }
}
