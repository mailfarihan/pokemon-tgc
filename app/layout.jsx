import '@styles/globals.css';
import Provider from '@components/Providers';

export const metadata ={
    title: "Pokemon TGC",
    description: 'Trade Pokemon'
}

function RootLayout({children}) {

  return (
    
    <html lang='en'>
        <head>
            <link rel='icon' href='/favicon.ico'/>
        </head>
        <body>
            <div className='main'>
                <div className='gradient'/>
            </div>
                <Provider>
                    <main className='app'>
                        {children}
                    </main>
                </Provider>
        </body>
    </html>
  )
}

export default RootLayout