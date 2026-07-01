# OtomataLab — Makefile
# ============================================================
#  make dev      → run both backend and frontend in dev mode
#  make build    → build production binary (includes frontend)
#  make start    → run the production binary
# ============================================================

.PHONY: dev dev-backend dev-frontend build start clean install

# Development — run Go on :8888 and Next.js on :3000 in parallel
dev:
	@echo "Starting dev servers (Go :8888, Next.js :3000)..."
	make -j2 dev-backend dev-frontend

dev-backend:
	cd backend && go run main.go

dev-frontend:
	cd frontend && npm run dev

# Production build — Next.js static export → copied to backend/static → embedded by Go
build:
	@echo "[1/3] Building Next.js frontend..."
	cd frontend && npm run build
	@echo "[2/3] Copying static files to backend/static..."
	if exist backend\static rmdir /s /q backend\static
	xcopy /E /I /Q frontend\out backend\static
	@echo "[3/3] Building Go binary..."
	cd backend && go build -o ../otomatalab.exe .
	@echo.
	@echo Build complete! Run: otomatalab.exe

# Run the production binary
start:
	./otomatalab.exe

# Install frontend dependencies
install:
	cd frontend && npm install

# Clean build artifacts
clean:
	if exist otomatalab.exe del otomatalab.exe
	if exist backend\static rmdir /s /q backend\static
	if exist frontend\out rmdir /s /q frontend\out
	if exist frontend\.next rmdir /s /q frontend\.next
	@echo Cleaned.
