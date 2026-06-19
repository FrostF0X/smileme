with open('src/App.jsx', 'r') as f:
    c = f.read()
if "return (" in c and "export default function App" in c and "<main" in c:
    print("Looks good.")
else:
    print("Something is wrong with App.jsx.")
