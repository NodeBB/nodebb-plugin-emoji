declare global {
  namespace NodeBB {
    interface Nodebb {
      require(module: string): any;
    }
  }

  const nodebb: NodeBB.Nodebb;
}

export {};
