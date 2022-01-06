package com.ilazar.myapp2.todo.data.local

import androidx.lifecycle.LiveData
import androidx.room.*
import com.ilazar.myapp2.todo.data.Task

@Dao
interface TaskDao {
    @Query("SELECT * from items ORDER BY text ASC")
    fun getAll(): LiveData<List<Task>>

    @Query("SELECT * FROM items WHERE _id=:id ")
    fun getById(id: String): LiveData<Task>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(task: Task)

    @Update(onConflict = OnConflictStrategy.REPLACE)
    suspend fun update(task: Task)

    @Query("DELETE FROM items")
    suspend fun deleteAll()
}