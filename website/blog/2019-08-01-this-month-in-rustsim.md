---
title: This month in rustsim #7 (June − July 2019)
author: Sébastien Crozet
---

Welcome to the seventh edition of _This month in rustsim_! This monthly newsletter will provide you with a
summary of important update that occurred within the rustsim community. This includes in particular updates about
the [**nphysics**](https://nphysics.org) (physics engine), [**ncollide**](https://ncollide.org) (for collision-detection),
[**nalgebra**](https://nalgebra.org) (for linear algebra),
and [**alga**](https://github.com/rustsim/alga) (for abstract algebra) crates. This seventh edition will actually contain updates for the past
two months.


<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW) and on our [user forum](https://discourse.nphysics.org)!

# Progress of current developments
## nphysics 0.12: Continuous collision detection has landed!

We are thrilled to announce that the version 0.12 of nphysics has been released! This contains several long awaited features:

- The support for linear and non-linear **continuous-collision detection (CCD)** with colliders on rigid bodies and sensors.
- Rigid body **velocity damping**: this allows to artificially slow down some bodies. This is essencial for, e.g., top-down 2D
  games where traditional coulomb friction cannot be used.
- Rigid body **maximum velocity** limit: it is possible to force a rigid body to never get a velocity higher than a threshold.
- The possibility to use **custom containers** for bodies, colliders, joints, and force generators. This helps overcoming
  some difficulties related to borrowing, and also help for the integration of nphysics with other solutions. The physics
  world structures will no longer own those containers.

Upgrading from nphysics 0.11 to nphysics 0.12 will require some work because of the changes regarding
body/collider/joint/force generators containers. It is now your responsibility to keep those storage in memory somewhere
because they are no longer owned by the physics worlds. This has additional implications on the way bodies and colliders are
constructed. For more details, refer to the [user-guide](https://www.nphysics.org/rigid_body_simulations_with_contacts/) of
nphysics which has been updated accordingly.

Continuous collision detection (CCD) and its usage with nphysics is described on a brand new page of the nphysics
[user-guide](https://www.nphysics.org/continuous_collision_detection/)! You can see some examples in the following video:

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/EnjgJp9mKz0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

In particular, notice that CCD also works on sensors (aka. triggers), which, suprisingly,
is not the case on most other open-source physics engines!


## ncollide 0.20 Non-linear time-of-impact computation and pipeline refactoring

With ncollide 0.20, it is now possible to compute the time of impact between two shapes undergoing an arbitrary rigid motion.
This is known as non-linear time-of-impact computation. This is used by the new CCD integration on nphysics 0.12.

In addition, the `query` module has been completely reworked so functions of geometric queries have more logical names.
The `world`, `narrow_phase` and `broad_phase` modules have also been reworked and merged into a single module named `pipeline`.
This new pipeline module also include low-level functions (in the `pipeline::glue` submodule) used to glue together the various  
part of a complete collision-detection pipeline. This can be used by those who want more flexibility than with the `CollisionWorld`.

The online user-guide and documentation of ncollide has **not** been updated to reflect those changes yet. We will work on this
during the next week-end.

# Next steps
The next logical step would be to add CCD support for colliders attached to multibodies and deformable bodies. However,
this is not what I will do as I would like to make a pause with CCD and do something I find much more exciting: adding fluids
to nphysics (based on the Smoothed Particle Hydrodynamics method). This work is expected to last one or two months (August
and September) and should require:

- The addition of a new shape to ncollide. This shape will represent a set of spheres with equal radii.
- The addition of a new body to nphysics. This body will represent a set of particles forming a fluid.
- The implementation of full interaction between the fluid body and the other types of body (rigid bodies, multibodies, and deformable bodies).
- All this in 2D and 3D. While we expect the 2D version to work in real-time up to a certain point, we don't promess that the
  3D version will be real-time (especially since we don't have any kind of parallelism in nphysics yet).

# Thanks
We would like to thank the whole community and contributors. In particular, thanks to the contributors from the past two months[^1]:

* [aleksijuvani](https://github.com/aleksijuvani)
* [distransient](https://github.com/distransient)
* [Jake-Shadle](https://github.com/Jake-Shadle)
* [jswrenn](https://github.com/jswrenn)
* Kristof Lünenschloß
* [sebcrozet](https://github.com/sebcrozet)
* [waywardmonkeys](https://github.com/waywardmonkeys)
* [Wesleysaur](https://github.com/Wesleysaur)
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks,
discuss features, and get assistance!

Finally, thanks to all the former, current and new patrons supporting me, [sebcrozet](https://github.com/sebcrozet), the
lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet)! This help is
greatly appreciated and allows me do spend a significant amount of time developing those crates.

[^1]: _The list of contributors is automatically generated from the past two months' github commit history.
Don't hesitate to let us know if your name should have been mentioned here._