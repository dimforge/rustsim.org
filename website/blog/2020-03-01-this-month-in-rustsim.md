---
title: This month in rustsim #9 (November 2019 to February 2020)
author: Sébastien Crozet
---

Welcome to the ninth edition of _This month in rustsim_! This newsletter will provide you with a
summary of important update that occurred within the rustsim community. This includes in particular updates about
the [**nphysics**](https://nphysics.org) (physics engine),  [**salva**](https://salva.rs) (fluid simulation), [**ncollide**](https://ncollide.org) (for collision-detection),
[**nalgebra**](https://nalgebra.org) (for linear algebra),
and [**alga**](https://github.com/rustsim/alga) (for abstract algebra) crates. This ninth edition will actually contain updates for the past
**four** months.


<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW) and on our [user forum](https://discourse.nphysics.org)!

# Progress on salva2d and salva3d v0.2

<center>
[![salva logo](https://www.salva.rs/img/logo_salva_full.svg)](https://salva.rs)
</center>



I am thrilled to announce that the release of massive improvements of **salva2d** and **salva3d** v0.2!

Recall that **salva** is our new project introduced a few months ago dedicated to **fluid simulation**.
The goal of **salva** is to provide CPU-based, particle-based, 2D and 3D, fluid simulation libraries that can be used for interactive
and offline applications like animation. The version 0.2.0 now contains several new features for both pressure resolution as well
as nonpressure forces:

* **Pressure resolution:** [DFSPH](https://animation.rwth-aachen.de/media/papers/2015-SCA-DFSPH.pdf)
  and [IISPH](https://cg.informatik.uni-freiburg.de/publications/2013_TVCG_IISPH.pdf). Unfortunately we removed
  our implementation of PBF because it is patented. 
* **Viscosity:** [DFSPH viscosity](https://animation.rwth-aachen.de/media/papers/2016-TVCG-ViscousDFSPH.pdf),
  [Artificial viscosity](http://www.astro.lu.se/~david/teaching/SPH/notes/annurev.aa.30.090192.pdf), and XSPH viscosity.
* **Surface tension:** [WCSPH](https://cg.informatik.uni-freiburg.de/publications/2007_SCA_SPH.pdf) surface tension, and
  methods from [He et al. 2014](http://peridynamics.com/publications/2014-He-RSS.pdf),
  and [Akinci et al. 2013](https://cg.informatik.uni-freiburg.de/publications/2013_SIGGRAPHASIA_surfaceTensionAdhesion.pdf).
* **Elasticity:** method from [Becker et al. 2009](https://cg.informatik.uni-freiburg.de/publications/2009_NP_corotatedSPH.pdf).

With the addition of new traits, it is also possible to define your own pressure resolution scheme as well as your own
nonpressure forces. You can see those features in action in the following video:

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/NBoSEanWHE4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

You can also play with those examples in the [2D WASM version](https://www.salva.rs/all_examples2/) and the
[3D WASM version](https://www.salva.rs/all_examples3/). However, for better performance, you are encouraged to compile
and run the examples on the `examples2d` and `examples3d` folders while enabling the `parallel` feature. For example:

```bash
git clone https://github.com/rustsim/salva
cd salva/examples3d
cargo run --release --bin all_examples3 --features parallel
```

In addition to those features it is now possible to:
- Remove fluids, boundaries, and collider couplings.
- Add/remove fluid particles after the fluid has been created. This is useful to simulate, e.g., sources of water. You
can for example see the [faucet demo](https://www.salva.rs/all_examples3d/?faucet).
- Enable the `parallel` feature to benefit from the parallelism (based on the `rayon` crate) of most stages of the fluid
  simulation. This includes parallel collision detection between particles, parallel pressure forces computation, 
  and parallel non-pressure forces computation. 

The most important feature that is missing now is a working implementation of adaptive time-stepping. While there
is an implementation of the CFL condition, it sometimes breaks the simulation for a reason that has yet to be determined.

# What's next for 2020
As mentioned in my previous post [about the future of nphysics](https://www.patreon.com/posts/28917514), the main goal
2020 is to focus on performances. Including (not necessarily in that order):

* Performing fine-grained performance optimizations, both in term of algorithms (for example rewriting a more efficient
  broad-phase approach) and in term of implementation (for example writing a SIMD-powered constraints solver).
* Performance improvements on nalgebra itself (the linear-algebra crate nphysics is based on).
* Adding parallelism to nphysics and ncollide.

Because I already focused a lot on parallelism on **salva**, I will start with the third objective: adding parallelism
to nphysics and ncollide. This will likely affect the API of low-level components (like the body and collider storages).

# Thanks
We would like to thank the whole community and contributors. In particular, thanks to the contributors from the past three months[^1]:

* [alvinhochun](https://github.com/alvinhochun)
* [cedric-h](https://github.com/cedric-h)
* [DasEtwas](https://github.com/DasEtwas)
* [james-rms](https://github.com/james-rms)
* [MJohnson459](https://github.com/MJohnson459)
* [NickMolloy](https://github.com/NickMolloy)
* [sebcrozet](https://github.com/sebcrozet)
* [SiegeLord](https://github.com/SiegeLord)
* [wsuchy](https://github.com/wsuchy)
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks,
discuss features, and get assistance!

Finally, thanks to all the former, current and new patrons supporting me, [sebcrozet](https://github.com/sebcrozet), the
lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet) or [GitHub sponsors](https://github.com/sponsors/sebcrozet/)!
This help is greatly appreciated and allows me do spend a significant amount of time developing those crates.

[^1]: _The list of contributors is automatically generated from the past four months' github commit history.
Don't hesitate to let us know if your name should have been mentioned here._
