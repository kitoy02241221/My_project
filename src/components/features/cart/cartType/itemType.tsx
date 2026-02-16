export type ItemType = {
    id: number;
    product_id: string;
    quantity: number;
    created_at: Date;
    product: {
        created_at: Date;
        description: string;
        id: string;
        image_url: string;
        name: string;
        price: number;
        updated_at: number;
        user_id: number;
    };
    totalPrice: number;
};
