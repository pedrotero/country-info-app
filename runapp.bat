@echo off

npm --prefix ./country-info-be install
npm --prefix ./country-info-fe install

start "" npm --prefix ./country-info-be run dev

start "" npm --prefix ./country-info-fe run dev