<script setup lang="ts">
const { signIn } = useUserSession()

async function _login() {
  await signIn.username({
    username: 'test',
    password: 'test',

  })
}
</script>

<template>
  <div>
    Nuxt module playground!
  </div>
</template>
