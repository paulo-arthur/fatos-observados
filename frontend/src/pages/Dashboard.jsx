import Navbar from "../components/Navbar";
import FOPannel from "../components/FOPannel";

export default function Login() {
    return (
        <div>
            <Navbar />

            <main>
                <header>
                    3 FOs · 1 julgado 
                </header>

                <div>
                    {(() => {
                        const pannels = [];
                        for (let i = 0; i < 5; i++) {
                            pannels.push(<FOPannel key={i}/>)
                        }
                        return pannels;
                    })()}
                </div>
            </main>
        </div>
    );
}