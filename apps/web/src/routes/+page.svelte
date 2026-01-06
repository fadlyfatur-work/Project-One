<script>
  let api;
  let error;

  async function check() {
    api = null;
    error = null;
    try {
      const res = await fetch("http://localhost:3000/api/health");
      api = await res.json();
    } catch (e) {
      error = String(e);
    }
  }
</script>

<h2>Home</h2>
<p>Ini halaman awal. Tombol di bawah ngetes koneksi ke backend.</p>

<button on:click={check}>Cek API Health</button>

{#if api}
  <pre>{JSON.stringify(api, null, 2)}</pre>
{/if}

{#if error}
  <p style="color: red;">{error}</p>
{/if}
