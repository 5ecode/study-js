'use strict';
/*----------------------------------------------------------------------
@callApiModule
----------------------------------------------------------------------*/
export class callApiModule {
  constructor(data) {
    this.data = data;
  }

  async init() {
    const res = await fetch(this.data)
    const users = await res.json();
    return users;
  }
}