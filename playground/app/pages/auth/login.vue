<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
definePageMeta({
  name: 'HomePage',
})

const { signIn, signUp } = useUserSession()

const loginForm = reactive({
  username: '',
  password: '',
})

const signupForm = reactive({
  username: '',
  password: '',
  name: '',
  email: '',
})

const activeTab = ref('login')

async function login() {
  await signIn.username({
    username: loginForm.username,
    password: loginForm.password,
  })
}

async function signup() {
  await signUp.email({
    username: signupForm.username,
    password: signupForm.password,
    name: signupForm.name,
    email: signupForm.email,
  })
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
      <div class="flex border-b border-gray-200">
        <button
          :class="['flex-1 py-4 text-base border-none cursor-pointer transition-all', { 'bg-blue-50 font-bold text-blue-500': activeTab === 'login' }]"
          @click="activeTab = 'login'"
        >
          Login
        </button>
        <button
          :class="['flex-1 py-4 text-base border-none cursor-pointer transition-all', { 'bg-blue-50 font-bold text-blue-500': activeTab === 'signup' }]"
          @click="activeTab = 'signup'"
        >
          Sign Up
        </button>
      </div>

      <div
        v-if="activeTab === 'login'"
        class="p-6"
      >
        <h2 class="mt-0 mb-6 text-center text-gray-800">
          Login
        </h2>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label
              for="login-username"
              class="block mb-2 text-sm text-gray-600"
            >Username</label>
            <input
              id="login-username"
              v-model="loginForm.username"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="mb-4">
            <label
              for="login-password"
              class="block mb-2 text-sm text-gray-600"
            >Password</label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <button
            type="submit"
            class="w-full py-3 bg-blue-500 text-white border-none rounded-md text-base cursor-pointer transition-colors hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>

      <div
        v-if="activeTab === 'signup'"
        class="p-6"
      >
        <h2 class="mt-0 mb-6 text-center text-gray-800">
          Sign Up
        </h2>
        <form @submit.prevent="signup">
          <div class="mb-4">
            <label
              for="signup-name"
              class="block mb-2 text-sm text-gray-600"
            >Name</label>
            <input
              id="signup-name"
              v-model="signupForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="mb-4">
            <label
              for="signup-email"
              class="block mb-2 text-sm text-gray-600"
            >Email</label>
            <input
              id="signup-email"
              v-model="signupForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div class="mb-4">
            <label
              for="signup-username"
              class="block mb-2 text-sm text-gray-600"
            >Username</label>
            <input
              id="signup-username"
              v-model="signupForm.username"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div class="mb-4">
            <label
              for="signup-password"
              class="block mb-2 text-sm text-gray-600"
            >Password</label>
            <input
              id="signup-password"
              v-model="signupForm.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <button
            type="submit"
            class="w-full py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
