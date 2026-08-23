import "./Loginpage.css";
import Home from "../assets/home.svg";
import google from '../assets/google.svg'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signUp } from "../services/firebase";

export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (event) => {
		event.preventDefault();
		setError("");

		if (!email.trim() || !password || !confirmPassword) {
			setError("กรุณากรอกข้อมูลให้ครบ");
			return;
		}

		if (password.length < 6) {
			setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
			return;
		}

		if (password !== confirmPassword) {
			setError("รหัสผ่านไม่ตรงกัน");
			return;
		}

		setLoading(true);
		try {
			await signUp(email, password);
			navigate("/Home", { replace: true });
		} catch (authError) {
			setError(authError.code === "auth/email-already-in-use"
				? "อีเมลนี้มีบัญชีอยู่แล้ว"
				: "สมัครสมาชิกไม่สำเร็จ");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleRegister = async () => {
		setError("");
		setLoading(true);
		try {
			await signInWithGoogle();
			navigate("/Home", { replace: true });
		} catch (authError) {
			console.error(authError);
			setError("ไม่สามารถสมัครด้วย Google ได้");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="main-container-lg">
			<div className="container-login register-page">
				<div className="title-login">
					<img src={Home} alt="Home" />
					<h1>สมัครสมาชิก</h1>
					<p>สร้างบัญชี KhongKhun</p>
				</div>
				<form className="signIn-Up" onSubmit={handleRegister}>
					<div className="usn-psw">
						<div className="username">
							<label htmlFor="register-email">อีเมล</label>
							<input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
						</div>
						<div className="password">
							<label htmlFor="register-password">รหัสผ่าน</label>
							<input id="register-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
						</div>
						<div className="password">
							<label htmlFor="confirm-password">ยืนยันรหัสผ่าน</label>
							<input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={6} />
						</div>
					</div>
					<div className="btn-signIn-Up">
						<button className="login" type="submit" disabled={loading}>
							{loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
						</button>
						<button className="google" type="button" disabled={loading} onClick={handleGoogleRegister}>
							<p>สมัครด้วย</p> <img src={google} alt="" />
						</button>
						<button className="signup" type="button" disabled={loading} onClick={() => navigate("/")}>
							ย้อนกลับ
						</button>
					</div>
					{error && <p role="alert">{error}</p>}
				</form>
			</div>
		</div>
	);
}
