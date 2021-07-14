<template>
  <main>
    <section
      id="intro"
      class="
        flex
        h-screen
        w-full
        justify-center
        items-center
        relative
        overflow-hidden
      "
    >
      <img
        ref="moon"
        src="@/assets/image/moon.png"
        alt="moon"
        class="
          h-full
          object-center object-cover
          w-full
          top-0
          left-0
          absolute
          mix-blend-screen
        "
      />
      <img
        ref="stars"
        src="@/assets/image/stars.png"
        alt="stars"
        class="
          h-full
          object-center object-cover
          w-full
          top-0
          left-0
          -z-1
          absolute
        "
      />
      <img
        ref="mountainFront"
        src="@/assets/image/mountains_front.png"
        alt="mountains"
        class="
          h-full
          object-center object-cover
          w-full
          top-0
          left-0
          z-6
          absolute
        "
      />
      <img
        ref="mountainBehind"
        src="@/assets/image/mountains_behind.png"
        alt="mountains"
        class="
          h-full
          object-center object-cover
          w-full
          top-0
          left-0
          z-4
          absolute
        "
      />
      <h1
        ref="title"
        class="
          font-extrabold
          text-white
          transform
          top-1/2
          -right-20
          text-6xl
          z-5
          -translate-y-1/2
          translate-0
          whitespace-nowrap
          absolute
        "
      >
        Welcome to my workshop!
      </h1>
      <a
        href="#chat"
        ref="exploreButton"
        class="
          bg-white
          border-none
          rounded-full
          cursor-pointer
          font-semibold
          outline-none
          py-2
          transform
          px-8
          text-[#2b1055] text-2xl
          z-9
          translate-y-25
          no-underline
          25
        "
        @click="explore"
      >
        Explore
      </a>
    </section>

    <section
      id="chat"
      class="h-screen bg-[#1c0522] justify-center items-center"
    >
      <h2>Chat</h2>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'Index',
  setup() {
    const moon = ref<HTMLImageElement>()
    const stars = ref<HTMLImageElement>()
    const mountainFront = ref<HTMLImageElement>()
    const mountainBehind = ref<HTMLImageElement>()
    const title = ref<HTMLHeadingElement>()
    const exploreButton = ref<HTMLButtonElement>()

    const parallaxScrolling = () => {
      const scrollY = window.scrollY

      ;(moon.value as HTMLImageElement).style.transform = `translateY(${
        scrollY * 1.05
      }px)`
      ;(stars.value as HTMLImageElement).style.transform = `translateX(${
        -scrollY * 0.5
      }px)`
      ;(
        mountainBehind.value as HTMLImageElement
      ).style.transform = `translateY(${scrollY * 0.5}px)`
      ;(title.value as HTMLHeadingElement).style.marginRight = `${
        scrollY * 4
      }px`
      ;(title.value as HTMLHeadingElement).style.marginTop = `${scrollY * 1}px`
      ;(exploreButton.value as HTMLButtonElement).style.marginTop = `${
        scrollY * 2
      }px`
    }

    onMounted(() => {
      parallaxScrolling()
      window.addEventListener('scroll', parallaxScrolling)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', parallaxScrolling)
    })

    return { exploreButton, moon, mountainFront, mountainBehind, stars, title }
  }
})
</script>

<style lang="scss" scoped>
#intro::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 5rem;
  background-image: linear-gradient(to top, #1c0522, transparent);
  z-index: 98;
}

img {
  pointer-events: none;
}
//  translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
// translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
</style>
