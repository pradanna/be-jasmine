<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/presentation/components/Navbar.svelte';
  import Footer from '$lib/presentation/components/Footer.svelte';
  import CartDrawer from '$lib/presentation/components/CartDrawer.svelte';
  import CartToastNotification from '$lib/presentation/components/CartToastNotification.svelte';

  let { data, children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-white">
  <Navbar categories={data.categories} />
  
  <main class="flex-1">
    {@render children()}
  </main>

  <Footer settings={data.settings} />
  <CartDrawer whatsappNumber={data.settings.whatsapp_number} />
  <CartToastNotification />
</div>
