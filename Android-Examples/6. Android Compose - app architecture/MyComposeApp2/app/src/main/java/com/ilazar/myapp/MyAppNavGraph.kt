package com.ilazar.myapp

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.ilazar.myapp.auth.LoginScreen
import com.ilazar.myapp.todo.ItemScreen
import com.ilazar.myapp.todo.items.ItemsScreen

@Composable
fun MyAppNavGraph(
    navController: NavHostController = rememberNavController(),
    startDestination: String = "login"
) {
    NavHost(
        navController = navController,
        startDestination = startDestination,
    ) {
        composable("items") {
            ItemsScreen(navController = navController)
        }
        composable("item") {
            ItemScreen(navController = navController)
        }
        composable("login") {
            LoginScreen(navController = navController)
        }
    }
}
