import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import rokaLoginBg from './assets/roka_login_bg.png';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Mount: apply lock
        document.body.classList.add('login-page-body');
        document.documentElement.classList.add('login-page-body');

        // Unmount: remove lock to restore normal scrolling for other pages
        return () => {
            document.body.classList.remove('login-page-body');
            document.documentElement.classList.remove('login-page-body');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://armyprojectbackend.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login success:', data);
                navigate('/dashboard');
            } else {
                alert('로그인 정보가 잘못되었습니다.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div className="login-container" style={{ backgroundImage: `url(${rokaLoginBg})` }}>
            <div className="login-overlay">
                <div className="login-card">
                    <div className="roka-badge">ROKA</div>
                    <h2 className="login-title">전사망자 관리체계</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">군 이메일</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="army@army.mil"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
