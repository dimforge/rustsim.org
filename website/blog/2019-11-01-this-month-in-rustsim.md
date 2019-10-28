---
title: This month in rustsim #7 (August − September - October 2019)
author: Sébastien Crozet
---

Welcome to the eighth edition of _This month in rustsim_! This monthly newsletter will provide you with a
summary of important update that occurred within the rustsim community. This includes in particular updates about
the [**nphysics**](https://nphysics.org) (physics engine),  [**salva**](https://nphysics.org) (fluid simulation), [**ncollide**](https://ncollide.org) (for collision-detection),
[**nalgebra**](https://nalgebra.org) (for linear algebra),
and [**alga**](https://github.com/rustsim/alga) (for abstract algebra) crates. This eighth edition will actually contain updates for the past
**three** months (I got sick between the second and third month so I did not get the time to write a new post then. Sorry!)


<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW) and on our [user forum](https://discourse.nphysics.org)!

# Progress of current developments
## Two new crates for fluid simulation: salva2d and salva3d!

<center>
[![salva logo](https://www.salva.rs/img/logo_salva_full.svg)](https://salva.rs)
</center>



We are thrilled to announce that the release of two new crates: **salva2d** and **salva3d**!
Check out their website: **[salva.rs](https://salva.rs)**


**Salva** is our new project dedicated to **fluid simulation**.
The goal of **salva** is to provide CPU-based, particle-based, 2D and 3D, fluid simulation libraries that can be used for interactive
and offline application like animation. It could be used, to some extents, for video games (especially the 2D version),
as long as the number of particles is kept small. Right know, salva is still very new and lacks a lot of features.
We don't consider it to be ready for public use, though we feel like it's a good time to share our progress so far.
Right now, the following features are supported:

- **Pressure resolution** based on the Position-Based-Fluids (PBF) method.
- **Viscosity** based on the XSPH method.
- **Multi-phase fluids** with different densities and viscosity coefficient.
- **Two-way coupling** with **nphysics**: fluids can interact with nphysics' rigid bodies, multibodies, and deformable bodies.
  Large density ratios are not well handled yet.

This last point is the one that took us the most time to get right from a design point of view. At first, we wanted to
implement fluid simulation directly as part of **nphysics**. This proved very difficult considering particle-based fluids
use their very own type of force computation methods and even have their own ways of detecting contacts. Moreover, it 
turns out most of the literature on two-way coupling already assume that rigid-bodies are handled in a separate engine.
Hence, it was both more easier, more efficient, and cleaner, to design **salva2d** and **salva3d** as crates of their owns.


The name of the project, **salva**, is inspired from the famous artist `Salvador Dalì`. The logo of Salva is inspired
from its renown painting [The Persistence of Memory](https://en.wikipedia.org/wiki/The_Persistence_of_Memory) featuring
melting clocks. You can **salva** it in action (including two-way coupling) in the following video:

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/356unTmeVUk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

You can also play with it in the [2D WASM version](https://www.salva.rs/demo_all_examples2/) and the
[3D WASM version](https://www.salva.rs/demo_all_examples3/).


## Improvements on nphysics 0.13
### Some support of breakable joint constraints

It is now possible to define a maximum break force for joints constraints on nphysics 0.13. Simply call
the `.set_break_force` or `.set_break_torque` method from any joint constraint and it will automatically
break as soon as the joint would be required to deliver more than this break force/torque.

### More improvements on the integration with ECS
The version 0.12 of nphysics introduces a massive change on ways bodies, colliders, and joints, were stored. However
it was still not quite enough to allow custom ECS-compliant storages to be used as storages for nphysics entities.
This is now much simplified with the amazing contribution made by [@distansient](https://github.com/distransient) from
the Amethyst community. You may want to take a look at [specs-physics](https://github.com/amethyst/specs-physics) which
is a work-in-progress crate for integrating `nphysics` with `specs`.

## New sponsorship platform: GitHub sponsor
I (the main developer of all the current rustsim projects) have been added to the GitHub sponsor beta. This means that
besides [patreon](http://patreon.com/sebcrozet), it is now possible to make a financial contribution through GitHub
sponsor [there](https://github.com/sponsors/sebcrozet/).
Also note that GitHub will match your donations during the first year! So for each $ donated, GitHub will itself donate
the same amount as a bonus!

Your continued help allows me to dedicate more time to those Rust crates. **Thank you all!**


# Next steps
The next two months will be dedicated to making **salva** ready for public use. In particular the priority will be to:

- Allow the **removal of fluid and boundary** objects from the world. Right now you can only add them.
- Allow the **removal of a coupling** with a collider from **nphysics**. Right now you can only add them.
- Implement another pressure resolution method: **DFSPH**. The user will be able to choose between the PBF and DFSPH solvers.
  This will also allow us to improve the design of **salva** to define the traits required to allow users to define their
  own solvers.
- Implement **surface tension**.
- Implement (optional) **adaptive timestepping**.


# Thanks
We would like to thank the whole community and contributors. In particular, thanks to the contributors from the past three months[^1]:

* alex
* [azriel91](https://github.com/azriel91)
* [burjui](https://github.com/burjui)
* [distransient](https://github.com/distransient)
* [dodomorandi](https://github.com/dodomorandi)
* [Duddino](https://github.com/Duddino)
* [eclipseo](https://github.com/eclipseo)
* [hmunozb](https://github.com/hmunozb)
* [jmeggitt](https://github.com/jmeggitt)
* Pierre Avital
* [Ralith](https://github.com/Ralith)
* [sebcrozet](https://github.com/sebcrozet)
* [thibaultbarbie](https://github.com/thibaultbarbie)
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks,
discuss features, and get assistance!

Finally, thanks to all the former, current and new patrons supporting me, [sebcrozet](https://github.com/sebcrozet), the
lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet) or [GitHub sponsors](https://github.com/sponsors/sebcrozet/)!
This help is greatly appreciated and allows me do spend a significant amount of time developing those crates.

[^1]: _The list of contributors is automatically generated from the past two months' github commit history.
Don't hesitate to let us know if your name should have been mentioned here._