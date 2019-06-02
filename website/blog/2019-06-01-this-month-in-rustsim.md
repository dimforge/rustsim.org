---
title: This month in rustsim #6 (April − May 2019)
author: Sébastien Crozet
---

Welcome to the sixth edition of _This month in rustsim_! This monthly newsletter will provide you with a
summary of important update that occurred within the rustsim community. This includes in particular updates about
the [**nphysics**](https://nphysics.org) (physics engine), [**ncollide**](https://ncollide.org) (for collision-detection),
[**nalgebra**](https://nalgebra.org) (for linear algebra),
and [**alga**](https://github.com/rustsim/alga) (for abstract algebra) crates. This sixth edition will actually contain updates for the past
two months.


<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW) and on our [user forum](https://discourse.nphysics.org)!

# Progress of current developments
## Continuous Collision Detection (CCD) on ncollide
We are currently working on the addition of continuous collision detection to ncollide. Given two shapes following
user-defined time-dependent trajectory, the goal of CCD is to compute the time when they will touch
(aka. their _time of impact_). We can distinguish:

- _Linear_ CCD which only takes into account the translational motions of both objects. This has been implemented within
`ncollide` for some time now with the `query::time_of_impact` function. This proved to have multiple robustness issues
which have been addressed as part of the current developments.
- _Nonlinear_ CCD which takes both the translational and rotation motions of the moving objects. As of today, this has been
implemented as a `query::nonlinear_time_of_impact` function and only works with convex shapes. We plan to handle non-convex
shapes too in the future once we reach good results with convex shapes when combined with nphysics.

Those improvements/additions have not been released yet. You can take a look at the [ccd branch](https://github.com/rustsim/ncollide/tree/ccd) in the mean time.

## Continuous Collision Detection (CCD) on nphysics
Adding support for CCD to nphysics will allow to overcome the issue known as "tunnelling": when a fast dynamic
body misses collisions with some colliders. For example this can cause a bullet to miss its target, or a fast-moving player
to traverse a wall. Integrating CCD fixes this by automatically performing several smaller timesteps when it detects that a collision
is about to be missed (using ncollide's time-of-impact computation). This comes with a performance cost, therefore it
has to be enabled explicitly by the user for each collider which which no contact must be missed.

The ongoing work on CCD integration to nphysics happens on the [ccd branch](https://github.com/rustsim/nphysics/tree/ccd).
Our initial goal was to release a first
version that works on rigid bodies this month. Unfortunately, we are not there yet because we faced several limitations
due the current design of ncollide and Rust borrowing rules for mutable references. In short, the encapsulation on ncollide
is a bit too strong, making it difficult for the nphysics world to iterate simultaneously and mutably through
collison objects, rigid bodies, and contact manifolds.

Right now we've worked around those problems by making public some fields of the ncollide `CollisionWorld`, but that's
not a satisfactory solution and more work is needed to get a cleaner approach. Though with this workaround in place we
made some progress regarding the implementation of automatic substepping (aka. conservative advancement) of rigid bodies.


## Next steps
We expect the work on CCD to take much more time that initially expected and intend release things progressively:

1. June will be dedicated to addressing the architectural issues mentioned in the previous section.
2. July will be dedicated to finishing the work on rigid bodies, with both linear and nonlinear CCD support.
3. August will be dedicated to adding support for CCD to multibodies. This has to be dealt with differently than rigid
bodies because of the reduced-coordinates modeling of constraints between multibody links.
4. September will be dedicated to adding support for CCD to deformable bodies.

If all goes well, new releases of ncollide and nphysics should happen at the end of July, August, and September.


# Thanks
We would like to thank the whole community and contributors. In particular, thanks to the contributors from the past two months[^1]:

* [aleksijuvani](https://github.com/aleksijuvani) who modified bounding volume computation traits to allow methods without the isometry parameter. This also allowed significant improvements of the AABB computation for triangles and triangle meshes.
* [jswrenn](https://github.com/jswrenn) who added assertions to nalgebra to prevent cases where you could end up with multiple mutable references to the same matrix component when taking a slices with some stride values.
* [Atul9](https://github.com/Atul9)
* [dcecile](https://github.com/dcecile)
* [dhardy](https://github.com/dhardy)
* [KappaDistributive](https://github.com/KappaDistributive)
* Kristof Lünenschloß
* [Laaas](https://github.com/Laaas)
* [lassade](https://github.com/lassade)
* [pengowen123](https://github.com/pengowen123)
* [Ralith](https://github.com/Ralith)
* [sebcrozet](https://github.com/sebcrozet)
* [tatref](https://github.com/tatref)
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks,
discuss features, and get assistance!

Finally, thanks to all the former, current and new patrons supporting me, [sebcrozet](https://github.com/sebcrozet), the
lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet)! This help is
greatly appreciated and allows me do spend a significant amount of time developing those crates.

[^1]: _The list of contributors is automatically generated from the past two months' github commit history.
Don't hesitate to let us know if your name should have been mentioned here._