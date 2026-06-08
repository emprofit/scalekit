import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <main className="bg-slate-50">
      <Header />
      {children}
      <Footer />
    </main>
  );
}