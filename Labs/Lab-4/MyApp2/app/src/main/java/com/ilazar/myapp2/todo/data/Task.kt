package com.ilazar.myapp2.todo.data

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "items")
data class Task(
    @PrimaryKey @ColumnInfo(name = "_id") val _id: String,
    @ColumnInfo(name = "text") var text: String,
    @ColumnInfo(name = "category") var category: String,
) {
    override fun toString(): String = "$category-$text"
}
