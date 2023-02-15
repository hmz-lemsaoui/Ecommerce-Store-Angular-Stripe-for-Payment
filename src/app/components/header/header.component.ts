import { Component, Input } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  itemQuantity = 0;

  @Input()
  get cart(): Cart{
    return this._cart;
  }
  set cart(cart: Cart){
    this._cart = cart;
    this.itemQuantity = this._cart.items
      .map((item) => item.quantity)
      .reduce((prev,current) => prev + current ,0);
  }

  constructor(private cartService: CartService) {}

  getTotal(cartItems: Array<CartItem>): number{
    return this.cartService.getTotal(cartItems);
  }
  onClearCart(): void{
    this.cartService.onClearCart();
  }
}
