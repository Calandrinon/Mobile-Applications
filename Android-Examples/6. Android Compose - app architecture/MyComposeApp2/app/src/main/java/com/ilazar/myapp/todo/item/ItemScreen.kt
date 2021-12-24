package com.ilazar.myapp.todo

import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Save
import androidx.compose.runtime.*
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.ilazar.myapp.R
import com.ilazar.myapp.todo.item.ItemViewModel

val TAG = "ItemScreen"

@Composable
fun ItemScreen(navController: NavController) {
    val itemViewModel = viewModel<ItemViewModel>()
    val fetching = itemViewModel.fetching.observeAsState().value
    val fetchingError = itemViewModel.fetchingError.observeAsState().value
    val completed = itemViewModel.completed.observeAsState().value
    var itemText by remember { mutableStateOf("") }
    var submitStarted by remember { mutableStateOf(false) }
    Log.d(TAG, "recompose $completed $submitStarted");
    if (completed != null) {
        if (submitStarted && completed) {
            Log.d(TAG, "navigate");
            submitStarted = false;
            navController.navigate("items")
        }
    }
    Scaffold(
        topBar = {
            TopAppBar(title = { Text(text = stringResource(id = R.string.item)) })
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    Log.d(TAG, "save $itemText");
                    submitStarted = true
                    itemViewModel.saveOrUpdateItem(itemText)
                },
            ) { Icon(imageVector = Icons.Rounded.Save, contentDescription = "Save") }
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {
            TextField(
                label = { Text(text = "Text") },
                value = itemText,
                onValueChange = { itemText = it },
                modifier = Modifier.fillMaxWidth()
            )
            if (fetching != null && fetching) {
                LinearProgressIndicator(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(15.dp)
                );
            }
            if (fetchingError != null) {
                Text(text = "Fetching failed")
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ItemScreenPreview() {
    ItemScreen(rememberNavController())
}