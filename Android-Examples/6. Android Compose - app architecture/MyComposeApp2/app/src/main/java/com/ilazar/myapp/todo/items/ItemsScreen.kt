package com.ilazar.myapp.todo.items

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.Save
import androidx.compose.runtime.Composable
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.ilazar.myapp.R
import com.ilazar.myapp.todo.data.Item

@Composable
fun ItemsScreen(navController: NavController) {
    Scaffold(
        topBar = { TopAppBar(title = { Text(text = stringResource(id = R.string.items)) }) },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { navController.navigate("item") },
            ) { Icon(imageVector = Icons.Rounded.Add, contentDescription = "Save") }
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {
            val loginViewModel = viewModel<ItemsViewModel>()
            val loading = loginViewModel.loading.observeAsState().value
            val itemList = loginViewModel.items.observeAsState().value
            val loadingError = loginViewModel.loadingError.observeAsState().value
            if (loading != null && loading) {
                LinearProgressIndicator(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(15.dp)
                );
            } else if (loadingError != null) {
                Text(text = "Loading failed")
            } else {
                ItemList(itemList!!)
            }
        }
    }
}

@Composable
fun ItemList(itemList: List<Item>) {
    LazyColumn {
        items(itemList) { item ->
            ItemDetail(item)
        }
    }
}

@Composable
fun ItemDetail(item: Item) {
    Row(modifier = Modifier.padding(all = 8.dp)) {
        Column {
            Text(
                text = item.text,
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ItemsScreenPreview() {
    ItemsScreen(rememberNavController())
}