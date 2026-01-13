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
    let password="";
    let error="";

    async function handleSubmit() {
        console.log('email', email);
        console.log('password', password);

        error = '';
        auth.update( v => ({
            ...v,
            isAuthenticated: false,
            loading: true
        }));

        const res = await fetch(`${PUBLIC_API_URL}/auth/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include',
            body: JSON.stringify({email, password})
        });
        
        const data = await res.json();
        
        console.log("data from BE:", data);
        console.log("data ac from BE:", data.accessToken);
        console.log("data user from BE:", data.user);
        

        if(!res.ok){
            error = data?.error?.message ?? 'Login Gagal!';
            auth.update(v => ({
                ...v, isAuthenticated:false, loading:false
            }));
            return;
        }

        //simpan access token
        setAccessToken(data.accessToken);
        
        //update auth store
        auth.set({
            user: data.user,
            isAuthenticated: true,
            loading: false
        })

        // redirect 
        goto('/dashboard');
    }

</script>

<h2>Login</h2>

<form on:submit|preventDefault={handleSubmit}>
    <div style="margin-bottom: 12px">
        <label for="email">Email/Username</label> <br />
        <input 
            type="text"
            name="email"
            bind:value={email}
            placeholder=""
            required
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

    <p style="color:red">{error}</p>
    <button type="submit">Login</button>
</form>