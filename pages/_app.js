import './estilo.css'
import { Inter} from '@next/font/google';
const inter = Inter ({ subsets: ['latin-ext'] });

function MyApp({Component, pageProps}){
    return <Component className={inter.className} {...pageProps}/>
}

export default MyApp