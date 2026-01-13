<script lang="ts">
    import { auth } from '$lib/stores/auth';
    console.log(auth.user);
</script>

<h1>Dashboard</h1>

{#if $auth.user}
    <p>Welcome. {$auth.user.username}</p>
{/if}