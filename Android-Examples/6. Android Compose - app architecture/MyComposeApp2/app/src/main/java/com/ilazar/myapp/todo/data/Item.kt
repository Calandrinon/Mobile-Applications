package com.ilazar.myapp.todo.data

data class Item(
    val _id: String,
    var text: String
) {
    override fun toString(): String = text
}
