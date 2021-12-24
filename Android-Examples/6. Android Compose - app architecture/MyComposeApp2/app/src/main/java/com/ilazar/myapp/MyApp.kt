package com.ilazar.myapp

import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.ilazar.myapp.theme.MyAppTheme

@Composable
fun MyApp() {
    MyAppTheme {
        Surface(color = MaterialTheme.colors.background) {
            MyAppNavGraph()
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MyAppPreview() {
    MyApp()
}