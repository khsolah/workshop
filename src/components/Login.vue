<template>
  <section
    class="
      bg-gray-800 bg-opacity-50
      transform
      translate-x-full
      top-0
      right-0
      bottom-0
      left-0
      z-99
      delay-300
      filter
      blur-sm
      fixed
    "
    :class="{ '!translate-x-0 !delay-0': expand }"
  >
    <div
      class="
        transform
        origin-center
        top-1/2
        left-1/2
        -translate-x-1/2 -translate-y-1/2
        absolute
        lg:w-md lg:h-xl
      "
    >
      <div
        class="
          bg-white
          rounded-md
          transform
          transition-transform
          scale-0
          duration-300
          lg:w-md lg:h-xl lg:px-15 lg:pt-15
        "
        :class="{ '!scale-100': expand }"
      >
        <router-link
          class="bg-transparent top-4 right-4 absolute"
          :to="{ hash: '' }"
          replace
        >
          <Icon name="close" class="fill-red-600 lg:w-7 lg:h-7" />
        </router-link>
        <h1 class="font-bold text-black text-4xl">Login</h1>
        <form
          class="
            border-solid border-1 border-gray-400 border-0 border-b-1
            lg:my-8 lg:pb-8
          "
        >
          <div class="flex-col mt-6 mb-8 w-full inline-flex relative">
            <label
              for="email"
              class="font-normal text-sm -top-6 left-0 text-gray-500 absolute"
              >E-mail</label
            >
            <input
              type="text"
              id="email"
              v-model="email"
              class="
                border-solid
                rounded-lg
                outline-none
                border-1
                text-base
                py-2
                pl-12
                text-gray-700
              "
              autocomplete
              placeholder="test@gmail.com"
              required
            />
            <Icon
              name="email"
              class="
                transform
                top-1/2
                left-4
                -translate-y-1/2
                absolute
                lg:w-4 lg:h-4
              "
            />
          </div>
          <div class="flex-col mt-6 mb-10 w-full inline-flex relative">
            <label
              for="password"
              class="font-normal text-sm -top-6 left-0 text-gray-500 absolute"
              >Password</label
            >
            <input
              :type="passwordFieldType"
              id="password"
              v-model="password"
              class="
                border-solid
                rounded-lg
                outline-none
                border-1
                text-base
                py-2
                px-12
                text-gray-700
              "
              autocomplete
              placeholder="test-password"
              required
            />
            <Icon
              name="key"
              class="
                transform
                top-1/2
                left-4
                -translate-y-1/2
                absolute
                lg:w-4 lg:h-4
              "
            />
            <Icon
              :name="passwordFieldIconName"
              class="
                cursor-pointer
                transform
                top-1/2
                right-4
                -translate-y-1/2
                absolute
                lg:w-4 lg:h-4
              "
              @click.prevent="togglePasswordFieldType"
            />
          </div>

          <button
            class="
              border-none
              rounded-full
              cursor-pointer
              font-semibold
              mx-auto
              outline-none
              bg-[#2b1055]
              text-xl text-light-300
              disabled:text-white
              lg:w-full
              disabled:bg-gray-500
              lg:h-11
            "
            @click.prevent="signInWithEmail"
            :disabled="email === '' && password === ''"
          >
            Sign In
          </button>
        </form>

        <button
          class="
            bg-white
            border-solid
            rounded-full
            cursor-pointer
            flex
            font-semibold
            mx-auto
            outline-none
            border-[#2b1055] border-1
            text-xl text-[#2b1055]
            justify-center
            items-center
            block
            lg:w-full lg:h-11
          "
          @click.prevent="signInWithGoogle"
        >
          <img
            src="@/assets/image/google-logo.png"
            alt="Google Icon"
            class="lg:w-4 lg:h-4 lg:mr-4"
          />
          <span>Log in with Google</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Firebase from 'firebase/app'
import 'firebase/auth'
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  name: 'Login',
  setup() {
    const email = ref('test@gmail.com')
    const password = ref('test-password')
    const passwordFieldType = ref<'password' | 'text'>('password')
    const passwordFieldIconName = ref<'eye' | 'eye-off'>('eye-off')

    const togglePasswordFieldType = () => {
      passwordFieldType.value =
        passwordFieldType.value === 'text' ? 'password' : 'text'
      passwordFieldIconName.value =
        passwordFieldType.value === 'text' ? 'eye' : 'eye-off'
    }

    const signInWithEmail = () => {
      console.log('[signinwithemail]')
      Firebase.auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }

    const signInWithGoogle = () => {
      Firebase.auth()
        .signInWithPopup(new Firebase.auth.GoogleAuthProvider())
        .then(response => console.log(response))
    }

    const $route = useRoute()
    const expand = computed(() => {
      console.log('[expand]: ', $route.hash === '#login')
      return $route.hash === '#login'
    })

    return {
      email,
      password,
      passwordFieldType,
      passwordFieldIconName,
      togglePasswordFieldType,
      signInWithEmail,
      signInWithGoogle,
      expand
    }
  },
  components: {
    Icon
  }
})
</script>
