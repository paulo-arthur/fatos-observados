import Navbar from "../components/Navbar";

export default function Login() {
    return (
        <div>
            <Navbar />

            <main>
                <div>
                    <label htmlFor="">Email</label>
                    <input type="text" name="email" id="email" />
                </div>

                <div>
                    <label htmlFor="">Senha</label>
                    <input type="text" name="password" id="password" />
                </div>

                <button>
                    Entrar
                </button>
            </main>
        </div>
    );
}