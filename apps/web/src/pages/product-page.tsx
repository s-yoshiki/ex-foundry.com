import { ProductDetail } from "../features/product-detail/components/product-detail";
import { getProduct, getProductSlug } from "../features/product-detail/functions/get-product";
import { Link } from "../routing/link";
import { useNavigation } from "../routing/navigation-context";
import { useDocumentMeta } from "../routing/use-document-meta";

export function ProductPage() {
  const { location } = useNavigation();
  const slug = getProductSlug(location.pathname);
  const product = slug === undefined ? undefined : getProduct(slug);

  const route = product
    ? {
        description: product.application.description,
        id: "apps" as const,
        navLabel: "アプリ一覧",
        path: `/products/${product.application.slug}/`,
        title: `${product.application.name} - EX FOUNDRY`,
      }
    : {
        description: "指定されたプロダクトは存在しないか、移動しました。",
        id: "apps" as const,
        navLabel: "アプリ一覧",
        path: "/apps/",
        title: "プロダクトが見つかりません - EX FOUNDRY",
      };

  useDocumentMeta(route);

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-bold">プロダクトが見つかりません</h1>
        <p className="mt-4 text-muted-foreground">
          指定されたプロダクトは存在しないか、移動しました。
        </p>
        <Link className="mt-8 inline-block font-semibold text-primary" to="apps">
          アプリ一覧へ戻る
        </Link>
      </section>
    );
  }

  return <ProductDetail product={product} />;
}
