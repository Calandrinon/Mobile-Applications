package com.ilazar.myapp.auth

import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.ilazar.myapp.R

val TAG = "LoginScreen"

@Composable
fun LoginScreen(navController: NavController) {
    val loginViewModel = viewModel<LoginViewModel>()
    Scaffold(
        topBar = { TopAppBar(title = { Text(text = stringResource(id = R.string.login)) }) },
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {
            var username by remember { mutableStateOf("") }
            TextField(
                label = { Text(text = "Username") },
                value = username,
                onValueChange = { username = it },
                modifier = Modifier.fillMaxWidth()
            )
            var password by remember { mutableStateOf("") }
            TextField(
                label = { Text(text = "Password") },
                visualTransformation = PasswordVisualTransformation(),
                value = password,
                onValueChange = { password = it },
                modifier = Modifier.fillMaxWidth()
            )
            var loginStarted by remember { mutableStateOf(false) }
            var loginFailed by remember { mutableStateOf(false) }
            Log.d(TAG, "recompose - loginStarted: $loginStarted, loginFailed: $loginFailed");
            Button(onClick = {
                Log.d(TAG, "login...");
                loginStarted = true;
                loginFailed = false;
                loginViewModel.login(username = username, password = password)
            }) {
                Text("Login")
            }
            if (loginStarted) {
                LinearProgressIndicator(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(15.dp)
                );
            }
            if (loginFailed) {
                Text(text = "Login failed")
            }
            val loginResult = loginViewModel.loginResult.observeAsState().value;
            if (loginResult != null) {
                if (loginStarted && loginResult.isSuccess) {
                    Log.d(TAG, "navigate");
                    navController.navigate("items")
                }
                if (loginResult.isFailure) {
                    loginFailed = true;
                }
                loginStarted = false;
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LoginScreenPreview() {
    LoginScreen(rememberNavController())
}