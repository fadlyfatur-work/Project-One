<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
  <title>Base Web</title>
</svelte:head>

<div style="max-width: 960px; margin: 0 auto; padding: 24px;">
  <header style="display:flex; justify-content:space-between; align-items:center;">
    <h1 style="margin:0;">Base Web</h1>
    <nav style="display:flex; gap:12px;">
      <a href="/">Home</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/admin">Admin</a>
      <a href="/profile">Profile</a>
    </nav>
  </header>

  <main style="padding-top: 24px;">
    {@render children()}
  </main>
</div>


{@render children()}
