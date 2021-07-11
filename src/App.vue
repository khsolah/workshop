<template>
  <header
    class="
      bg-transparent
      flex
      bg-opacity-80
      h-20
      w-full
      top-0
      right-0
      left-0
      z-99
      fixed
      items-center
      lg:px-10
      xl:px-15
    "
  >
    <router-link
      :to="{ name: 'Index' }"
      class="
        font-bold
        text-white text-base text-3xl
        no-underline
        uppercase
        !bg-transparent
      "
      >logo</router-link
    >
    <nav class="flex h-full ml-auto mr-0 items-center">
      <ul class="flex list-none h-10 pl-0 items-center">
        <li class="h-full text-white ml-5">
          <router-link
            :to="{ name: 'Index' }"
            class="
              rounded-full
              flex
              font-semibold
              h-full
              px-6
              active:bg-white
              items-center
              justify-center
            "
            >Home</router-link
          >
        </li>
      </ul>
    </nav>
  </header>
  <router-view />
  <footer></footer>
</template>

<style lang="scss">
* {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: 'Poppins', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  background-image: linear-gradient(#2b1055, #7597de);
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.router-link-exact-active {
  @apply bg-white text-[#2b1055];
}
</style>
