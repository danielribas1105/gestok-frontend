import Image from "next/image"
import LoginForm from "./components/login-form"
import logo from "@/../public/logo/logo-gestok.png"

export default function LoginPage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-muted px-4">
			<div className="w-full max-w-md space-y-4">
				<div className="text-center">
					<div className="mx-auto w-96 h-44 bg-transparent rounded-xl flex items-center justify-center">
						<Image src={logo} alt="Logo" />
					</div>
					<h1 className="text-3xl font-bold text-foreground">Bem-vindo</h1>
					<p className="mt-2 text-sm text-foreground">
						Entre com sua conta para continuar
					</p>
				</div>

				<div className="bg-background text-foreground rounded-2xl shadow-sm border border-border px-8 py-4">
					<LoginForm />
				</div>
			</div>
		</main>
	)
}
