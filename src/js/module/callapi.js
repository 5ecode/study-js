'use strict';
/*----------------------------------------------------------------------
@CallApiModule
----------------------------------------------------------------------*/
export class CallApiModule {
  constructor(data) {
    this.data = data;
  }

  async init() {
    const res = await fetch(this.data)
    const users = await res.json();
    return users;
  }
}