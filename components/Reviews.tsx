import { wc } from "@/lib/woocommerce";
import ReviewsCarousel from "@/components/ReviewsCarousel";

// WooCommerce review objects include reviewer_email — never forward that to
// the client, the homepage only ever renders these public fields.
function publicReview(r: any) {
  return {
    id: r.id,
    reviewer: r.reviewer,
    review: r.review,
    rating: r.rating,
    product_name: r.product_name,
  };
}

export default async function Reviews() {
  let reviews: ReturnType<typeof publicReview>[] = [];
  try {
    const data = await wc.getProductReviews({ status: "approved", per_page: "12", orderby: "date", order: "desc" });
    reviews = (Array.isArray(data) ? data : []).map(publicReview);
  } catch {
    reviews = [];
  }

  // No real reviews yet — nothing honest to show here. The section reappears
  // on its own once customers start reviewing products from the PDP.
  if (reviews.length === 0) return null;

  return <ReviewsCarousel reviews={reviews} />;
}
