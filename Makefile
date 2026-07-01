# OtomataLab — Makefile
# ============================================================

.PHONY: dev build start install clean

# Development — requires Vercel CLI (npm i -g vercel)
dev:
	@echo "Starting Vercel Dev server (Next.js + Go Functions)..."
	vercel dev

build:
	@echo "Building for Vercel..."
	vercel build

start:
	@echo "Deploying to Vercel..."
	vercel deploy

install:
	npm install

clean:
	if exist .next rmdir /s /q .next
	if exist out rmdir /s /q out
	@echo Cleaned.
