package com.ilazar.myapp2.todo.items

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.ilazar.myapp2.R
import com.ilazar.myapp2.core.TAG
import com.ilazar.myapp2.todo.data.Task
import com.ilazar.myapp2.todo.item.TaskEditFragment

class TaskListAdapter(
    private val fragment: Fragment,
) : RecyclerView.Adapter<TaskListAdapter.ViewHolder>() {

    var items = emptyList<Task>()
        set(value) {
            field = value
            notifyDataSetChanged();
        }

    private var onItemClick: View.OnClickListener = View.OnClickListener { view ->
        val item = view.tag as Task
        fragment.findNavController().navigate(R.id.ItemEditFragment, Bundle().apply {
            putString(TaskEditFragment.ITEM_ID, item._id)
        })
    };

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.view_item, parent, false)
        Log.v(TAG, "onCreateViewHolder")
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        Log.v(TAG, "onBindViewHolder $position")
        val item = items[position]
        holder.textView.text = item.toString()
        holder.itemView.tag = item
        holder.itemView.setOnClickListener(onItemClick)
    }

    override fun getItemCount() = items.size

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val textView: TextView

        init {
            textView = view.findViewById(R.id.text)
        }
    }
}
