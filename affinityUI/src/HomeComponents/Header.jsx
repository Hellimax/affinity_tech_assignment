export default function Header() {
  return (
    <header className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Affinity E-commerce</h1>
        {/* <div className="flex items-center space-x-4">
          <button className="text-muted-foreground hover:text-foreground">Search</button>
          <button className="text-muted-foreground hover:text-foreground">Cart</button>
          <button className="text-muted-foreground hover:text-foreground">Account</button>
        </div> */}
      </div>
    </header>
  )
}
