/**
 * ============================================================
 * main.jsx - Titik Masuk Utama Aplikasi React (Entry Point)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * File ini ibarat "MCB Utama / Sumber Daya Utama".
 * 
 * Di sinilah React "menyalakan" aplikasi dengan cara:
 * 1. Mengambil elemen HTML dengan id="root" dari file index.html.
 * 2. Memuat gaya visual global dari index.css.
 * 3. Merender (menampilkan) komponen <App /> ke dalam elemen tersebut.
 * ============================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
