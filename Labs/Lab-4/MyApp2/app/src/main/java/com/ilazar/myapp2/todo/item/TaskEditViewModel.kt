package com.ilazar.myapp2.todo.item

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.ilazar.myapp2.core.Result
import com.ilazar.myapp2.core.TAG
import com.ilazar.myapp2.todo.data.Task
import com.ilazar.myapp2.todo.data.TaskRepository
import com.ilazar.myapp2.todo.data.local.TaskDatabase
import kotlinx.coroutines.launch

class TaskEditViewModel(application: Application) : AndroidViewModel(application) {
    private val mutableFetching = MutableLiveData<Boolean>().apply { value = false }
    private val mutableCompleted = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val fetching: LiveData<Boolean> = mutableFetching
    val fetchingError: LiveData<Exception> = mutableException
    val completed: LiveData<Boolean> = mutableCompleted

    val taskRepository: TaskRepository

    init {
        val itemDao = TaskDatabase.getDatabase(application, viewModelScope).itemDao()
        taskRepository = TaskRepository(itemDao)
    }

    fun getItemById(itemId: String): LiveData<Task> {
        Log.v(TAG, "getItemById...")
        return taskRepository.getById(itemId)
    }

    fun saveOrUpdateItem(task: Task) {
        viewModelScope.launch {
            Log.v(TAG, "saveOrUpdateItem...");
            mutableFetching.value = true
            mutableException.value = null
            val result: Result<Task>
            if (task._id.isNotEmpty()) {
                result = taskRepository.update(task)
            } else {
                result = taskRepository.save(task)
            }
            when(result) {
                is Result.Success -> {
                    Log.d(TAG, "saveOrUpdateItem succeeded");
                }
                is Result.Error -> {
                    Log.w(TAG, "saveOrUpdateItem failed", result.exception);
                    mutableException.value = result.exception
                }
            }
            mutableCompleted.value = true
            mutableFetching.value = false
        }
    }
}