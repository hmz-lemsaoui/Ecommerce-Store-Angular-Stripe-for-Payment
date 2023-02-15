import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [] };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ];

  constructor(
    private cartService: CartService,
    private httpClient: HttpClient
  ) {}
  ngOnInit(): void{
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(cartItems: Array<CartItem>): number{
    return this.cartService.getTotal(cartItems);
  }

  onClearCart(): void{
    this.cartService.onClearCart();
  }
  onRemoveFromCart(item: CartItem): void{
    this.cartService.onRemoveFromCart(item);
  }
  onAddQuantity(item: CartItem): void{
    this.cartService.addToCart(item);
  }
  onRemoveQuantity(item: CartItem): void{
    this.cartService.removeQuantity(item);
  }

  onCheckout(): void{
    this.httpClient.post('http://localhost:4242/checkout',{
      items: this.cart.items
    }).subscribe(async(res: any) => {
      let stripe = await loadStripe('pk_test_51MYcYLLrAAAW4nlkFTWfeQhW9rZNbSdsKelbH5L8otT2RvxUlvc7nmxZBCUaidQB22BZ31MgCSLM0a6cQCUJzLqe00wwitZPmr');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    });
  }
}
