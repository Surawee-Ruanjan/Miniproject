import Link from 'next/link'

const Navbar = () => (
    <div>
        <Link href="/"><a> <b>Home Page</b></a></Link> |
        <Link href="/register"><a> <b>Staff</b> </a></Link>  |
        <Link href="/login"><a> <b>Staff Login</b> </a></Link> |
        <Link href="/houseedit"><a> <b>Staff Edit</b> </a></Link> |
        <Link href="/search"><a> <b>Search</b> </a></Link> |
        <Link href="/logout"><a> <b>Logout</b> </a></Link>  
    </div>
)

export default Navbar