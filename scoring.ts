@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  background-color: #080E14;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #1F2A38 #080E14;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up {
  animation: fadeUp 0.35s ease-out;
}
