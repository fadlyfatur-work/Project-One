<!-- form email/password
POST /auth/login
simpan access token ke memory via setAccessToken
update store auth
redirect ke /dashboard -->

<script lang="ts">
	import { goto } from "$app/navigation";
	import { PUBLIC_API_URL } from "$env/static/public";
	import { setAccessToken } from "$lib/api";
	import { auth } from "$lib/stores/auth";

    let email="";
    let username="";
    let password="";
    let repassword="";
    let error="";

    async function handleSubmit() {
        console.log('email', email);
        console.log('username', username);
        console.log('password', password);
        console.log('repassword', repassword);

        error = '';
        auth.update( v => ({
            ...v,
            loading: true
        }));

        if (password !== repassword) {
            error = 'Password tidak cocok!';
            return;
        }

        const res = await fetch(`${PUBLIC_API_URL}/auth/register`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include',
            body: JSON.stringify({email, username, password})
        })

        const data = await res.json();

        if(!res.ok){
            error = data?.error?.message ?? 'Registrasi akun Gagal!';
            auth.update(v => ({
                ...v, loading:false
            }));
            return;
        }

        // redirect 
        goto('/login');
    }

</script>

<h2>Sign Up</h2>

<form on:submit|preventDefault={handleSubmit}>
    <div style="margin-bottom: 12px">
        <label for="email">Email <span style="color: red;">*</span></label> <br />
        <input 
            type="email"
            name="email"
            bind:value={email}
            placeholder=""
            required
        >
    </div>

    <div style="margin-bottom: 12px">
        <label for="email">Username</label> <br />
        <input 
            type="text"
            name="username"
            bind:value={username}
            placeholder=""
        >
    </div>

    <div style="margin-bottom: 12px">
        <label for="password">Password</label><br />
        <input 
            type="password"
            bind:value={password}
            required
        >
    </div>

    <div style="margin-bottom: 12px">
        <label for="password">Re-Password</label><br />
        <input 
            type="password"
            bind:value={repassword}
            required
        >
    </div>

    <p style="color:red">{error}</p>
    <button type="submit">Sign Up</button>
</form>