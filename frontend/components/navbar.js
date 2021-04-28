import Link from 'next/link'

const Navbar = () => (
    <div>
        <Link href="/"><a> <b>Home Page</b></a></Link> |
        <Link href="/register"><a> <b>Register</b> </a></Link>  |
        <Link href="/login"><a> <b>Login</b> </a></Link> |
        <Link href="/projectedit"><a> <b>Edit</b> </a></Link> |
        <Link href="/search"><a> <b>Search</b> </a></Link> |
        <Link href="/logout"><a> <b>Logout</b> </a></Link>  
    </div>
)

export default Navbar