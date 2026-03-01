import { defineStore } from 'pinia';
import { Notify } from 'quasar';
interface CarrinhoItem {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    quantidade: number;
}

export const useCarrinhoStore = defineStore('carrinho', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('carrinho') || '[]') as CarrinhoItem[],
    }),
    getters: {
        totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantidade, 0),
        totalValue: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantidade), 0),
    },
    actions: {
        addToCart(product: any) {
            const existingItem = this.items.find(item => item.id === product.id);
            const qntAtual = existingItem ? existingItem.quantidade : 0;
            const estoque = product.stock;
            if (qntAtual < estoque) {
                if (existingItem) {
                    existingItem.quantidade++;
                } else {
                    this.items.push({ ...product, quantidade: 1, stock: estoque });
                }
            } else {
                Notify.create({
                    type: 'warning',
                    message: estoque <= 0
                        ? 'Produto esgotado!'
                        : `Limite de ${estoque} unidades atingido.`,
                    position: 'top'
                });
            }
            localStorage.setItem('carrinho', JSON.stringify(this.items));
        },
        removeFromCart(productId: number) {
            const index = this.items.findIndex(item => item.id === productId);

            if (index !== -1) {
                const item = this.items[index];
                if (item && item.quantidade > 1) {
                    item.quantidade--;
                } else {
                    this.items.splice(index, 1);
                }
            }

            localStorage.setItem('carrinho', JSON.stringify(this.items));
        },

        clearItem(productId: number) {
            this.items = this.items.filter(item => item.id !== productId);
        },
        
        clearCart() {
            this.items = [];
            localStorage.removeItem('carrinho');
        }
    }
});