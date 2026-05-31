import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserData {
	uid: string;
	nama: string;
	email: string;
	nik: string;
	alamat: string;
	role: "kader" | "pasien-anak" | "pasien-hamil" | "pasien-dewasa" | "pasien-lansia";
	status_akun: "aktif" | "menunggu_verifikasi";
	dibuat_pada: string;
}

interface AuthContextType {
	user: User | null;
	userData: UserData | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setLoading(true);

			if (currentUser) {
				setUser(currentUser);

				try {
					const docRef = doc(db, "users", currentUser.uid);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						setUserData(docSnap.data() as UserData);
					} else {
						console.warn("User tidak ditemukan");
						setUserData(null);
					}
				} catch (err) {
					console.error("Gagal mengambil data :", err);
					setUserData(null);
				}
			} else {
				setUser(null);
				setUserData(null);
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	const contextValue: AuthContextType = {
		user,
		userData,
		loading,
	};

	return <AuthContext.Provider value={contextValue}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context == undefined) {
		throw new Error("useAuth harus digunakan di dalam komponen AuthProvider");
	}
	return context;
};
